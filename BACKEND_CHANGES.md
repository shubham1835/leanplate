# Backend changes required for new frontend features

## 1. Admin OTP Viewer — GET /api/v1/admin/otps/today

Add this endpoint to `AdminController.java`:

```java
@GetMapping("/otps/today")
public ResponseEntity<ApiResponse<List<OtpViewResponse>>> getTodayOtps() {
    return ResponseEntity.ok(ApiResponse.ok(otpStoreRepository.findTodayOtps(LocalDate.now())));
}
```

Add to `OtpStoreRepository.java`:

```java
@Query("""
    SELECT o FROM OtpStore o
    WHERE CAST(o.createdAt AS DATE) = :today
    ORDER BY o.createdAt DESC
    """)
List<OtpStore> findTodayOtps(@Param("today") LocalDate today);
```

Add response DTO `OtpViewResponse.java`:

```java
@Data @Builder
public class OtpViewResponse {
    private UUID id;
    private String phone;
    private String name;        // joined from users table
    private String otpCode;
    private boolean used;
    private int attempts;
    private LocalDateTime expiresAt;
    private LocalDateTime createdAt;
}
```

Add mapper in `AdminServiceImpl.java`:

```java
public OtpViewResponse toOtpResponse(OtpStore o) {
    // Look up user name by phone
    String name = userRepository.findByPhone(o.getPhone())
        .map(User::getName).orElse(null);
    return OtpViewResponse.builder()
        .id(o.getId()).phone(o.getPhone()).name(name)
        .otpCode(o.getOtpCode()).used(o.isUsed())
        .attempts(o.getAttempts())
        .expiresAt(o.getExpiresAt()).createdAt(o.getCreatedAt())
        .build();
}
```

## 2. FCM Topic Subscription — POST /api/v1/notifications/subscribe

Create `NotificationController.java`:

```java
@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final FirebaseMessaging firebaseMessaging;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<Void>> subscribe(
            @AuthenticationPrincipal FitFuelUserDetails user,
            @RequestBody SubscribeRequest req) {
        try {
            firebaseMessaging.subscribeToTopic(
                List.of(req.getFcmToken()),
                req.getTopic()
            );
            return ResponseEntity.ok(ApiResponse.ok("Subscribed", null));
        } catch (FirebaseMessagingException e) {
            throw new BadRequestException("FCM subscription failed: " + e.getMessage());
        }
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResponse<Void>> unsubscribe(
            @AuthenticationPrincipal FitFuelUserDetails user,
            @RequestBody SubscribeRequest req) {
        try {
            firebaseMessaging.unsubscribeFromTopic(
                List.of(req.getFcmToken()),
                req.getTopic()
            );
            return ResponseEntity.ok(ApiResponse.ok("Unsubscribed", null));
        } catch (FirebaseMessagingException e) {
            throw new BadRequestException("FCM unsubscription failed: " + e.getMessage());
        }
    }

    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> sendToTopic(
            @RequestBody SendNotificationRequest req) {
        try {
            Message message = Message.builder()
                .setTopic(req.getTopic())
                .setNotification(Notification.builder()
                    .setTitle(req.getTitle())
                    .setBody(req.getBody())
                    .build())
                .putAllData(req.getData() != null ? req.getData() : Map.of())
                .build();
            firebaseMessaging.send(message);
            return ResponseEntity.ok(ApiResponse.ok("Sent", null));
        } catch (FirebaseMessagingException e) {
            throw new BadRequestException("FCM send failed: " + e.getMessage());
        }
    }
}
```

Add Firebase Admin SDK to `pom.xml`:

```xml
<dependency>
    <groupId>com.google.firebase</groupId>
    <artifactId>firebase-admin</artifactId>
    <version>9.3.0</version>
</dependency>
```

Add `FirebaseConfig.java`:

```java
@Configuration
public class FirebaseConfig {
    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (FirebaseApp.getApps().isEmpty()) {
            // Place your serviceAccountKey.json in src/main/resources/
            InputStream serviceAccount =
                getClass().getResourceAsStream("/serviceAccountKey.json");
            FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();
            return FirebaseApp.initializeApp(options);
        }
        return FirebaseApp.getInstance();
    }

    @Bean
    public FirebaseMessaging firebaseMessaging(FirebaseApp app) {
        return FirebaseMessaging.getInstance(app);
    }
}
```

DTOs:

```java
@Data public class SubscribeRequest {
    private String fcmToken;
    private String topic;
}

@Data public class SendNotificationRequest {
    private String topic;
    private String title;
    private String body;
    private Map<String, String> data;
}
```

---

## 3. Order Status Push Notification

### In `OrderServiceImpl.java` — inject FirebaseMessaging and send push when status changes

```java
@Autowired
private FirebaseMessaging firebaseMessaging;

// Add to updateStatus() method, after saving the order:
private void sendOrderStatusPush(Order order, OrderStatus status) {
    String title = switch (status) {
        case PENDING    -> "⚡ Order Received!";
        case PREPARING  -> "👨‍🍳 Preparing Your Order";
        case READY      -> "✅ Order Ready for Pickup!";
        case COLLECTED  -> "🎉 Enjoy Your Meal!";
        case REJECTED   -> "❌ Order Rejected";
        default         -> "Order Update";
    };
    String body = switch (status) {
        case PENDING    -> "We got order #" + order.getOrderNumber() + ". Preparing soon!";
        case PREPARING  -> "Order #" + order.getOrderNumber() + " is being prepared. ~12 mins.";
        case READY      -> "Order #" + order.getOrderNumber() + " is ready! Come collect it.";
        case COLLECTED  -> "Order #" + order.getOrderNumber() + " collected. Bon appétit!";
        case REJECTED   -> "Order #" + order.getOrderNumber() + " couldn't be fulfilled. Contact us.";
        default         -> "Order #" + order.getOrderNumber() + " status updated.";
    };

    // Send to user's device token if stored, OR to the LEAN_PLATE_USER topic
    Message message = Message.builder()
        .setTopic("LEAN_PLATE_USER")   // broadcasts to all subscribed devices
        // OR use .setToken(userFcmToken) to target a specific device
        .setNotification(Notification.builder()
            .setTitle(title)
            .setBody(body)
            .build())
        .putData("orderId",     order.getId().toString())
        .putData("orderNumber", order.getOrderNumber())
        .putData("status",      status.name())
        .putData("type",        "ORDER_STATUS")
        .build();

    try {
        firebaseMessaging.send(message);
    } catch (FirebaseMessagingException e) {
        log.warn("[FCM] Order status push failed: {}", e.getMessage());
        // Don't throw — notification failure should not break order update
    }
}
```

Call it at the end of `updateStatus()`:
```java
// After orderRepository.save(order):
sendOrderStatusPush(order, status);
```

---

## 4. OTP Push Notification

### In `AuthServiceImpl.java` — send OTP as push notification

```java
@Autowired
private FirebaseMessaging firebaseMessaging;

// Replace/extend sendViaSms() with:
@Async
void sendOtpNotifications(String phone, String otp) {
    // 1. Send SMS (your existing SMS provider)
    // sendViaSms(phone, otp);

    // 2. Also send as FCM push to LEAN_PLATE_USER topic
    // (In production you'd target the specific device token for this phone number
    //  by looking up the stored FCM token for this phone in a fcm_tokens table)
    Message message = Message.builder()
        .setTopic("LEAN_PLATE_USER")
        // .setToken(lookupFcmTokenByPhone(phone))  // preferred — targets specific device
        .setNotification(Notification.builder()
            .setTitle("🔑 Your Fit Fuel OTP")
            .setBody("Your OTP is " + otp + ". Valid for 10 minutes. Do not share.")
            .build())
        .putData("otp",   otp)
        .putData("phone", phone)
        .putData("type",  "OTP")
        .build();

    try {
        firebaseMessaging.send(message);
        log.info("[FCM] OTP push sent to phone: {}", phone);
    } catch (FirebaseMessagingException e) {
        log.warn("[FCM] OTP push failed: {}", e.getMessage());
        // Non-fatal — OTP is stored in DB regardless
    }
}
```

Update `sendOtp()` to call `sendOtpNotifications(phone, otp)` instead of `sendViaSms()`.

### Optional: Store FCM tokens per user

Add a `fcm_tokens` table to link phone → FCM token for targeted delivery:

```sql
CREATE TABLE fcm_tokens (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    phone      VARCHAR(15) NOT NULL,
    token      TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (phone)
);
```

Add endpoint to save/update token after login:
```java
@PostMapping("/notifications/token")
public ResponseEntity<ApiResponse<Void>> saveToken(
        @AuthenticationPrincipal FitFuelUserDetails user,
        @RequestBody @Valid SaveTokenRequest req) {
    // upsert into fcm_tokens
    return ResponseEntity.ok(ApiResponse.ok("Token saved", null));
}
```

Then in `sendOtp()` and `sendOrderStatusPush()`, look up `fcmTokenRepository.findByPhone(phone)` to target the specific device instead of broadcasting to the topic.

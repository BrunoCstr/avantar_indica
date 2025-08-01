import UIKit
import Firebase
import FirebaseCore
import FirebaseMessaging
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import UserNotifications

@main
@objc(AppDelegate)
class AppDelegate: RCTAppDelegate, UNUserNotificationCenterDelegate, MessagingDelegate {
  override func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    // Inicializar Firebase
    FirebaseApp.configure()
    // Delegar mensagens FCM
    Messaging.messaging().delegate = self

    // Configurar permissões de notificação
    if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().delegate = self
      let authOptions: UNAuthorizationOptions = [.alert, .badge, .sound]
      UNUserNotificationCenter.current().requestAuthorization(
        options: authOptions,
        completionHandler: { _, _ in }
      )
    } else {
      let settings: UIUserNotificationSettings =
        UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
      application.registerUserNotificationSettings(settings)
    }

    // Registrar para notificações remotas
    application.registerForRemoteNotifications()

    // Configuração do React Native
    self.moduleName = "avantar_indica"
    self.dependencyProvider = RCTAppDependencyProvider()
    self.initialProps = [:]

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  // Implementação necessária para Background Fetch ativado
  override func application(_ application: UIApplication,
                            performFetchWithCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    completionHandler(.noData)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }

  // Enviar token APNs para o Firebase
  override func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {
    Messaging.messaging().apnsToken = deviceToken
  }

  // Token FCM atualizado (sem log)
  func messaging(_ messaging: Messaging, didReceiveRegistrationToken fcmToken: String?) {
    // Você pode salvar ou enviar esse token para o backend, se necessário
  }

  // Exibir notificações quando o app estiver em primeiro plano
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter,
                              willPresent notification: UNNotification,
                              withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([[.alert, .sound, .badge]])
  }
}


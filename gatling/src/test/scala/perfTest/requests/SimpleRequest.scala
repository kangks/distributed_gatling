package perfTest.requests

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import perfTest.config.Configurations.{ baseUrl }

object SimpleRequest {
  protected val log: ch.qos.logback.classic.Logger = org.slf4j.LoggerFactory.getLogger(getClass.getName).asInstanceOf[ch.qos.logback.classic.Logger]

  val getMainPage = 
    exec(
        http("Get main page")
            .get(baseUrl)
            .check(status.is(200))
            .check(regex("Amazon ECS").exists)
    )
}
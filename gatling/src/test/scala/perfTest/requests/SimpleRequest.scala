package perfTest.requests

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import perfTest.config.Configurations.{ baseUrl }

object SimpleRequest {
  val getMainPage = 
    exec(
        http("Get main page")
            .get(baseUrl)
            .check(status.is(200))
            .check(regex("Amazon ECS").exists)
    )
}
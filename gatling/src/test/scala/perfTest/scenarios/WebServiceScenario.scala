package perfTest.scenarios

import perfTest.requests.{ SimpleRequest }
import io.gatling.core.Predef._

object WebServiceScenario {
  protected val log: ch.qos.logback.classic.Logger = org.slf4j.LoggerFactory.getLogger(getClass.getName).asInstanceOf[ch.qos.logback.classic.Logger]

  val getMainPage = scenario("Get main page")
    .exec(SimpleRequest.getMainPage)
}
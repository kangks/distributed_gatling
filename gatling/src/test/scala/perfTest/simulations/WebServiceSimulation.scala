package perfTest.simulations

import scala.concurrent.duration._
import scala.util.Properties

import io.gatling.core.Predef._
import io.gatling.http.Predef._

import org.slf4j.LoggerFactory
import ch.qos.logback.classic.{Level, LoggerContext}

import perfTest.scenarios.{ WebServiceScenario }
import perfTest.config.Configurations.{ loadDurationInSeconds, loadRPS }

class WebServiceSimulation extends Simulation {

  val context: LoggerContext = LoggerFactory.getILoggerFactory.asInstanceOf[LoggerContext]
  val httpProtocol = http.enableHttp2.disableWarmUp
 
  setUp(
    WebServiceScenario
      .getMainPage
      .inject(
        constantUsersPerSec(loadRPS.toInt).during(loadDurationInSeconds.toInt seconds)
      )
  )
  .protocols(
    httpProtocol
  )
  .assertions(
    global.successfulRequests.percent.gt(99),
	  global.responseTime.max.lt(5000),
  )  

  before {
    println("Simulation is about to start!")
  }

  after {
    println("Simulation is finished!")
  }
}

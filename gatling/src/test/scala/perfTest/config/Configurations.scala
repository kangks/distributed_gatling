package perfTest.config

import com.typesafe.config.ConfigFactory
import com.typesafe.config.Config
import com.typesafe.config.ConfigValueType
import scala.collection.JavaConverters._
import scala.util.Properties

object Configurations {
    val config = ConfigFactory.load()

    private object ConfigValue {
        def apply(value: String): String =
            if (value.trim.isEmpty) ""
            else value.trim
    }

    private def readConfigValue(name: String, defaultValue: String = ""): String =
        if (System.getProperties().contains(name)){
            System.getProperty(name)
        }else{
            if (config.hasPathOrNull(name)) {
                if (config.getIsNull(name)) {
                    defaultValue
                }else{
                    ConfigValue(config.getString(name))
                }
            }else{
                defaultValue
            }
        }

    val baseUrl: String = readConfigValue("web.baseUrl")
    val loadRPS: String = readConfigValue("load.rps", "1")
    val loadDurationInSeconds: String = readConfigValue("load.durationInSeconds", "1")
}
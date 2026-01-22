package com.gcopilot.api

import org.springframework.boot.test.context.SpringBootTest
import spock.lang.Specification

@SpringBootTest
class UserAppSpec extends Specification {
    def "context loads"() {
        expect:
        true
    }
}

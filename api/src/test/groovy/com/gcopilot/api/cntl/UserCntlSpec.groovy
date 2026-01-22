package com.gcopilot.api.cntl

import com.gcopilot.api.dto.UserCreateRequest
import com.gcopilot.api.dto.UserResponse
import com.gcopilot.api.dto.UserUpdateRequest
import com.gcopilot.api.sve.UserSve
import spock.lang.Specification

class UserCntlSpec extends Specification {

    def userSve = Mock(UserSve)
    def userCntl = new UserCntl(userSve)

    def "createUser returns 201"() {
        given:
        def request = new UserCreateRequest("A", "a@x.com", 20)
        def response = new UserResponse(1L, "A", "a@x.com", 20)

        when:
        def result = userCntl.createUser(request)

        then:
        1 * userSve.createUser(request) >> response
        result.statusCode.value() == 201
        result.body.id() == 1L
    }

    def "getUser returns 200"() {
        given:
        def response = new UserResponse(2L, "B", "b@x.com", 22)

        when:
        def result = userCntl.getUser(2L)

        then:
        1 * userSve.getUser(2L) >> response
        result.statusCode.value() == 200
        result.body.email() == "b@x.com"
    }

    def "listUsers returns list"() {
        given:
        def responses = [new UserResponse(1L, "A", "a@x.com", 20)]

        when:
        def result = userCntl.listUsers()

        then:
        1 * userSve.listUsers() >> responses
        result.statusCode.value() == 200
        result.body.size() == 1
    }

    def "updateUser returns updated"() {
        given:
        def request = new UserUpdateRequest("C", "c@x.com", 33)
        def response = new UserResponse(3L, "C", "c@x.com", 33)

        when:
        def result = userCntl.updateUser(3L, request)

        then:
        1 * userSve.updateUser(3L, request) >> response
        result.statusCode.value() == 200
        result.body.name() == "C"
    }

    def "deleteUser returns 204"() {
        when:
        def result = userCntl.deleteUser(4L)

        then:
        1 * userSve.deleteUser(4L)
        result.statusCode.value() == 204
    }
}

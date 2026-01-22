package com.wipro.api.sve

import com.wipro.api.dto.UserCreateRequest
import com.wipro.api.dto.UserUpdateRequest
import com.wipro.api.exception.NotFoundException
import com.wipro.api.model.User
import com.wipro.api.repo.UserRepo
import spock.lang.Specification

class UserSveSpec extends Specification {

    def userRepo = Mock(UserRepo)
    def userSve = new UserSve(userRepo)

    def "createUser saves and returns response"() {
        given:
        def request = new UserCreateRequest("Alice", "alice@example.com", 30)
        def saved = new User(1L, "Alice", "alice@example.com", 30)

        when:
        def response = userSve.createUser(request)

        then:
        1 * userRepo.save(_ as User) >> saved
        response.id() == 1L
        response.name() == "Alice"
        response.email() == "alice@example.com"
        response.age() == 30
    }

    def "getUser returns user when found"() {
        given:
        def user = new User(2L, "Bob", "bob@example.com", 25)

        when:
        def response = userSve.getUser(2L)

        then:
        1 * userRepo.findById(2L) >> Optional.of(user)
        response.id() == 2L
        response.name() == "Bob"
    }

    def "getUser throws when missing"() {
        when:
        userSve.getUser(99L)

        then:
        1 * userRepo.findById(99L) >> Optional.empty()
        thrown(NotFoundException)
    }

    def "listUsers returns mapped list"() {
        given:
        def users = [
                new User(1L, "A", "a@x.com", 20),
                new User(2L, "B", "b@x.com", 21)
        ]

        when:
        def responses = userSve.listUsers()

        then:
        1 * userRepo.findAll() >> users
        responses.size() == 2
        responses*.id() == [1L, 2L]
    }

    def "updateUser updates and returns response"() {
        given:
        def existing = new User(5L, "Old", "old@x.com", 40)
        def request = new UserUpdateRequest("New", "new@x.com", 41)
        def saved = new User(5L, "New", "new@x.com", 41)

        when:
        def response = userSve.updateUser(5L, request)

        then:
        1 * userRepo.findById(5L) >> Optional.of(existing)
        1 * userRepo.save(_ as User) >> saved
        response.name() == "New"
        response.email() == "new@x.com"
        response.age() == 41
    }

    def "updateUser throws when missing"() {
        when:
        userSve.updateUser(10L, new UserUpdateRequest("N", "n@x.com", 20))

        then:
        1 * userRepo.findById(10L) >> Optional.empty()
        thrown(NotFoundException)
    }

    def "deleteUser deletes when exists"() {
        when:
        userSve.deleteUser(7L)

        then:
        1 * userRepo.existsById(7L) >> true
        1 * userRepo.deleteById(7L)
    }

    def "deleteUser throws when missing"() {
        when:
        userSve.deleteUser(8L)

        then:
        1 * userRepo.existsById(8L) >> false
        thrown(NotFoundException)
    }
}

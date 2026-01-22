package com.gcopilot.api.repo

import com.gcopilot.api.UserApp
import com.gcopilot.api.model.User
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ContextConfiguration
import org.springframework.test.annotation.DirtiesContext
import spock.lang.Specification

@SpringBootTest(classes = UserApp)
@ContextConfiguration(classes = UserApp)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class UserRepoSpec extends Specification {

    @Autowired
    UserRepo userRepo

    def "save and find user"() {
        given:
        def user = new User(null, "Repo", "repo@x.com", 28)

        when:
        def saved = userRepo.save(user)
        def found = userRepo.findById(saved.id)

        then:
        found.isPresent()
        found.get().email == "repo@x.com"
    }
}

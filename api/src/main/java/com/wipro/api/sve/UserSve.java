package com.wipro.api.sve;

import com.wipro.api.dto.UserCreateRequest;
import com.wipro.api.dto.UserResponse;
import com.wipro.api.dto.UserUpdateRequest;
import com.wipro.api.exception.NotFoundException;
import com.wipro.api.model.User;
import com.wipro.api.repo.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserSve {
    private final UserRepo userRepo;

    public UserSve(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        User saved = userRepo.save(new User(null, request.name(), request.email(), request.age()));
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: " + id));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepo.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new NotFoundException("User not found: " + id));
        user.setName(request.name());
        user.setEmail(request.email());
        user.setAge(request.age());
        return toResponse(userRepo.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new NotFoundException("User not found: " + id);
        }
        userRepo.deleteById(id);
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getAge());
    }
}

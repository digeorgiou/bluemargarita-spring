package gr.aueb.cf.bluemargarita.repository;

import gr.aueb.cf.bluemargarita.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>,
        JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
}

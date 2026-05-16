package com.example.backend_Ecom.service;

import java.util.ArrayList;
import java.util.List;

import com.example.backend_Ecom.entity.User;
import com.example.backend_Ecom.security.UserPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.example.backend_Ecom.repository.UserJpaRepository;

/**
 * tạo một lớp CustomUserDetailsService để tải thông tin người dùng từ cơ sở dữ liệu. Lớp này sẽ triển khai UserDetailsService và sử dụng UserJpaRepository để truy xuất thông tin người dùng
 */

/**
 * ở đây đưa thông tin vào để mã hóa thành token phải chú ý : trong token có chưa thông tin và server có thể mã hóa ra và xem dc : id , email....
 * nếu nhét thêm role và token thì có thể : không cần query DB để lấy role nữa. trường hợp này vẫn đúng
 * nếu ở trườngh hợp ko đuưa role vào jwt thì :
 * Request
 * -> đọc username từ JWT
 * -> query database lấy user
 * -> lấy roles
 * -> check quyền
 *
 * Tức là:
 *
 * mỗi request đều query DB
 *
 *
 * ///////////////////////////
 * Request
 * -> đọc username từ JWT
 * -> query database lấy user
 * -> lấy roles
 * -> check quyền
 *
 * Tức là:
 *
 * mỗi request đều query DB
 * /////////////////////////////////////////
 * thực tế thì trong các dự án nhỏ họ sẽ đưa role và jwt luôn : dễ code ít query db --> nhẹ
 * nhưng vấn đề khi đưa role vào jwt là gì : nếu bạn login và có jwt trong jwt đó mã hóa ra được bạn có role là admin với thời hạn jwt là 24h thì :
 * khi đổi role từ admin thành role khác nhưng vẫn đang còn time của jwt thì nó sẽ : user vẫn có quyền ADMIN đến khi token hết hạn.nên thầy có nói là role thay đổi thường xuyên
 *
 * **/
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserJpaRepository userRepository;

    public CustomUserDetailsService(UserJpaRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Load user details by email
     * 
     * Note: Method name is loadUserByUsername (from Spring interface), but parameter is EMAIL not username.
     * This is intentional - we authenticate users with EMAIL + PASSWORD, not username + password.
     * Spring Security requires this method name from the UserDetailsService interface.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        List<GrantedAuthority> authorities = new ArrayList<>();
        user.getRoles().forEach(role -> {
            // Nếu dùng @PreAuthorize("hasAuthority('ADMIN')") thì
            authorities.add(new SimpleGrantedAuthority(role.getName()));

            // Nếu dùng @PreAuthorize("hasRole('ADMIN')") thì authorities.add(new
            authorities.add(new SimpleGrantedAuthority("ROLE_" + role.getName()));
        });

        return new UserPrincipal(
            user.getId(),
            user.getEmail(),
            user.getPassword(),
            authorities
        );
    }
}

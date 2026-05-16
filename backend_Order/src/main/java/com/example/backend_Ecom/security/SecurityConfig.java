package com.example.backend_Ecom.security;

import com.example.backend_Ecom.exception.CustomAccessDeniedHandler;
import com.example.backend_Ecom.exception.CustomAuthenticationEntryPoint;
import com.example.backend_Ecom.filters.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity()
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptionHandlingCustomizer -> exceptionHandlingCustomizer
                        .authenticationEntryPoint(this.customAuthenticationEntryPoint)
                        .accessDeniedHandler(this.customAccessDeniedHandler))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()

                        // ✅ USER ADMIN ENDPOINTS
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/users/paging").hasRole("ADMIN")

                        // ✅ ADDRESS ENDPOINTS - CẦN AUTHENTICATION
                        .requestMatchers("/api/users/addresses/**").authenticated()

                        // ✅ USER PERSONAL ENDPOINTS - CẦN AUTHENTICATION + OWNERSHIP CHECK TRONG SERVICE
                        .requestMatchers(HttpMethod.GET, "/api/users/*").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/users/*").authenticated()

                        // ✅ PUBLIC GET — xem sản phẩm / blog không cần login
                        .requestMatchers(HttpMethod.GET, "/api/foods/**", "/api/drinks/**", "/api/desserts/**", "/api/freshs/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/blogs/**").permitAll()

                        // ✅ ADMIN-ONLY — tạo / sửa / xóa sản phẩm và blog (chỉ ADMIN mới được)
                        .requestMatchers(HttpMethod.POST, "/api/foods/**", "/api/drinks/**", "/api/desserts/**", "/api/freshs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/foods/**", "/api/drinks/**", "/api/desserts/**", "/api/freshs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/foods/**", "/api/drinks/**", "/api/desserts/**", "/api/freshs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/blogs").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/blogs/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/blogs/**").hasRole("ADMIN")

                        // ✅ BLOG REVIEW — user đăng nhập mới được đánh giá
                        .requestMatchers(HttpMethod.POST, "/api/blogs/*/reviews").authenticated()

                        // ✅ CART, ORDER, PAYMENT - CẦN AUTHENTICATION
                        .requestMatchers("/api/carts/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/orders/admin/paging").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/orders/*/status").hasRole("ADMIN")
                        .requestMatchers("/api/orders/**").authenticated()
                        .requestMatchers("/api/stocks/**").authenticated()
                        .requestMatchers("/api/payments/**").authenticated()

                        // ✅ MẶC ĐỊNH: Phải đăng nhập (bịt lỗ permitAll cũ)
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

package com.library.library_management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/admin-login.html",
                                "/admin-dashboard.html",
                                "/user-login.html",
                                "/user-register.html",
                                "/user-dashboard.html",
                                "/css/**",
                                "/js/**",
                                "/api/**"
                        ).permitAll()

                        .anyRequest().permitAll()
                );

        return http.build();
    }
}
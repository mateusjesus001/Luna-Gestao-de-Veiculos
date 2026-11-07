package com.minimalapi.seguranca;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            System.out.println("[SECURITY] 401 Unauthorized: " + request.getMethod() + " " + request.getRequestURI() + " - " + authException.getMessage());
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            System.out.println("[SECURITY] 403 Forbidden: " + request.getMethod() + " " + request.getRequestURI() + " - " + accessDeniedException.getMessage());
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        })
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/administradores/login").permitAll()
                        .requestMatchers("/", "/error", "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/administradores").hasRole("Adm")
                        .requestMatchers(HttpMethod.GET, "/administradores/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/administradores").permitAll()
                        .requestMatchers(HttpMethod.GET, "/veiculos", "/veiculos/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/veiculos", "/veiculos/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/veiculos", "/veiculos/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/veiculos", "/veiculos/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/motoristas", "/motoristas/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/motoristas", "/motoristas/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/motoristas", "/motoristas/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/motoristas", "/motoristas/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/rotas", "/rotas/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/rotas", "/rotas/**").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/rotas", "/rotas/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/rotas", "/rotas/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthenticationFilter(jwtService), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "https://localhost:*",
                "http://10.*.*.*:*",
                "http://192.168.*.*:*"
        ));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
package com.minimalapi.seguranca;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;


public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String PREFIXO_BEARER = "Bearer ";

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        // Pular autenticação para endpoint de login
        if (request.getMethod().equals("POST") && request.getRequestURI().endsWith("/administradores/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (header != null && header.regionMatches(true, 0, PREFIXO_BEARER, 0, PREFIXO_BEARER.length())) {
            String token = header.substring(PREFIXO_BEARER.length()).trim();
            // Remover aspas extras que o frontend pode enviar
            token = token.replaceAll("^\"|\"$", "").replaceAll("^'|'$", "").trim();
            if (!token.isEmpty() && !"undefined".equalsIgnoreCase(token) && !"null".equalsIgnoreCase(token)) {
                try {
                    String email = jwtService.extrairEmail(token);
                    String perfil = jwtService.extrairPerfil(token);

                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        java.util.List<SimpleGrantedAuthority> authorities = new java.util.ArrayList<>();
                        if (perfil != null && !perfil.trim().isEmpty()) {
                            authorities.add(new SimpleGrantedAuthority("ROLE_" + perfil.trim()));
                            if (perfil.equalsIgnoreCase("Adm")) {
                                authorities.add(new SimpleGrantedAuthority("ROLE_Adm"));
                                authorities.add(new SimpleGrantedAuthority("ROLE_ADM"));
                                authorities.add(new SimpleGrantedAuthority("ROLE_adm"));
                            } else if (perfil.equalsIgnoreCase("Editor")) {
                                authorities.add(new SimpleGrantedAuthority("ROLE_Editor"));
                                authorities.add(new SimpleGrantedAuthority("ROLE_EDITOR"));
                                authorities.add(new SimpleGrantedAuthority("ROLE_editor"));
                            }
                        }
                        var authentication = new UsernamePasswordAuthenticationToken(email, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("[JWT] Auth OK: email=" + email + " perfil=" + perfil + " authorities=" + authorities);
                    }
                } catch (Exception e) {
                    System.out.println("[JWT] Token inválido: " + e.getClass().getSimpleName() + " - " + e.getMessage());
                    SecurityContextHolder.clearContext();
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
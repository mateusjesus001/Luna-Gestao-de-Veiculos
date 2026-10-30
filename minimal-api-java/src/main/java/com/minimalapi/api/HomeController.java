package com.minimalapi.api;

import com.minimalapi.domain.modelviews.Home;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public Home home() {
        return new Home();
    }
}

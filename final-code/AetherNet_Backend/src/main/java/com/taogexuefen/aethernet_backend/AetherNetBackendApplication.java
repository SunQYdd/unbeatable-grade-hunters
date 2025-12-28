package com.taogexuefen.aethernet_backend;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@MapperScan("com.taogexuefen.aethernet_backend.mapper")
public class AetherNetBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(AetherNetBackendApplication.class, args);
    }

}

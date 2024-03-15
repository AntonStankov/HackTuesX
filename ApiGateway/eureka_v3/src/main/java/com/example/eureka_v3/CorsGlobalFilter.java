package com.example.eureka_v3;

import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

//@Component
//public class CorsGlobalFilter extends AbstractGatewayFilterFactory<Object> {
//
//    @Override
//    public GatewayFilter apply(Object config) {
//        return (exchange, chain) -> {
//            if (exchange.getRequest().getHeaders().containsKey("Origin")) {
//                exchange.getResponse().getHeaders().add("Access-Control-Allow-Origin", "*");
//                exchange.getResponse().getHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//                exchange.getResponse().getHeaders().add("Access-Control-Allow-Headers", "*");
//                exchange.getResponse().getHeaders().add("Access-Control-Max-Age", "3600");
//                if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
//                    exchange.getResponse().setStatusCode(HttpStatus.OK);
//                    return Mono.empty();
//                }
//            }
//            return chain.filter(exchange);
//        };
//    }
//}

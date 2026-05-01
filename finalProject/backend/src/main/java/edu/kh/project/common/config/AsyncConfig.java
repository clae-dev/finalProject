package edu.kh.project.common.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "tourApiExecutor")
    public Executor tourApiExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("tour-api-");
        executor.initialize();
        return executor;
    }

    /**
     * 조회수 증가 전용 Executor (fire-and-forget UPDATE)
     * 큐가 가득 차면 호출 스레드에서 직접 실행해 데이터 누락 방지(CallerRunsPolicy 기본).
     */
    @Bean(name = "viewCountExecutor")
    public Executor viewCountExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(4);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("view-count-");
        executor.initialize();
        return executor;
    }
}

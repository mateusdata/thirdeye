/*
 * Copyright 2024 StarTree Inc
 *
 * Licensed under the StarTree Community License (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at http://www.startree.ai/legal/startree-community-license
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT * WARRANTIES OF ANY KIND,
 * either express or implied.
 * See the License for the specific language governing permissions and limitations under
 * the License.
 */
package ai.startree.thirdeye.aspect;

import ai.startree.thirdeye.aspect.utils.DeterministicScheduler;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Aspect
public class ExecutorsAspect {
  
  private static final Logger LOG = LoggerFactory.getLogger(ExecutorsAspect.class);

  @Pointcut("call(public static java.util.concurrent.ScheduledExecutorService java.util.concurrent.Executors.newSingleThreadScheduledExecutor(..))")
  void newSingleThreadScheduledExecutor() {
  }

  @Pointcut("call(public static java.util.concurrent.ScheduledExecutorService java.util.concurrent.Executors.newScheduledThreadPool(..))")
  void newScheduledThreadPool() {
  }

  // most ScheduledExecutorServices are created around the start of the application
  // make sure to mock the time before creating the test support to enable this 
  @Around("newSingleThreadScheduledExecutor() || newScheduledThreadPool()")
  public Object deterministicScheduler(ProceedingJoinPoint pjp) throws Throwable {
    if (TimeProvider.instance().isTimedMocked()) {
      LOG.warn("Time is mocked - Mocking scheduled executor.");
      final DeterministicScheduler deterministicScheduler = new DeterministicScheduler();
      TimeProvider.registerScheduler(deterministicScheduler);
      return deterministicScheduler;
    }
    
    return pjp.proceed();
  }
  
  @Pointcut("call(public static * ai.startree.thirdeye.spi.util.MetricsUtils.scheduledRefreshSupplier(..))")
  void scheduledRefreshSupplier() {
  }
  
  @Around("scheduledRefreshSupplier()")
  public Object scheduledRefresh(ProceedingJoinPoint pjp) throws Throwable {
    if (TimeProvider.instance().isTimedMocked()) {
      LOG.warn("Time is mocked - Mocking the scheduledRefreshSupplier to not cache and not schedule.");
      return pjp.getArgs()[0];
    }

    return pjp.proceed();
  }
}

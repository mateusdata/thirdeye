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
package ai.startree.thirdeye.datalayer.bao;

import ai.startree.thirdeye.datalayer.dao.GenericPojoDao;
import ai.startree.thirdeye.spi.datalayer.DaoFilter;
import ai.startree.thirdeye.spi.datalayer.Predicate;
import ai.startree.thirdeye.spi.datalayer.bao.AbstractManager;
import ai.startree.thirdeye.spi.datalayer.dto.AbstractDTO;
import com.google.inject.persist.Transactional;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import org.checkerframework.checker.nullness.qual.NonNull;
import org.checkerframework.checker.nullness.qual.Nullable;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;

// todo authz - namespace filtering in child classes and this one is implemented in app. It should be performed in DB. Need to add a mapping and an index on namespace for all entities.
public abstract class AbstractManagerImpl<E extends AbstractDTO> implements AbstractManager<E> {

  protected final GenericPojoDao genericPojoDao;
  private final Class<? extends AbstractDTO> dtoClass;

  protected AbstractManagerImpl(final Class<? extends AbstractDTO> dtoClass,
      final GenericPojoDao genericPojoDao) {
    this.dtoClass = dtoClass;
    this.genericPojoDao = genericPojoDao;
  }

  @Override
  public Long save(final E entity) {
    if (entity.getId() != null) {
      //TODO: throw exception and force the caller to call update instead
      update(entity);
      return entity.getId();
    }
    final Long id = genericPojoDao.create(entity);
    entity.setId(id);
    return id;
  }

  @Override
  public int update(final E entity, final Predicate predicate) {
    return genericPojoDao.update(entity, predicate);
  }

  @Override
  public int update(final E entity) {
    return genericPojoDao.update(entity);
  }

  // Test is located at TestAlertConfigManager.testBatchUpdate()
  @Override
  public int update(final List<E> entities) {
    return genericPojoDao.update(entities);
  }

  @Override
  public E findById(final Long id) {
    return (E) genericPojoDao.get(id, dtoClass);
  }

  @Override
  public List<E> findByIds(final List<Long> ids) {
    return (List<E>) genericPojoDao.get(ids, dtoClass);
  }

  @Override
  public E findUniqueByNameAndNamespace(final @NonNull String name,
      final @Nullable String namespace) {
    final List<E> list = findByPredicate(
        Predicate.AND(
            Predicate.EQ("name", name),
            Predicate.OR(
                Predicate.EQ("namespace", namespace),
                // existing entities are not migrated automatically so they can have their namespace column to null in the index table, even if they do belong to a namespace 
                //  todo cyril authz - prepare migration scripts - or some logic to ensure all entities are eventually migrated
                Predicate.EQ("namespace", null)
            )
        )
    )
        // we still need to perform in-app filtering until all entities namespace are migrated in db - see above
        .stream().filter(e -> Objects.equals(e.namespace(), namespace)).toList();
    if (list.isEmpty()) {
      return null;
    } else if (list.size() == 1) {
      return list.iterator().next();
    } else {
      throw new IllegalStateException(String.format(
          "Found multiple entities with name %s and namespace %s. This should not happen. Please reach out to support.",
          name, namespace));
    }
  }

  @Override
  public int delete(final E entity) {
    return genericPojoDao.delete(entity.getId(), dtoClass);
  }

  // Test is located at TestAlertConfigManager.testBatchDeletion()
  @Override
  public int deleteById(final Long id) {
    return genericPojoDao.delete(id, dtoClass);
  }

  @Override
  public int deleteByIds(final List<Long> ids) {
    return genericPojoDao.delete(ids, dtoClass);
  }

  @Override
  public int deleteByPredicate(final Predicate predicate) {
    return genericPojoDao.deleteByPredicate(predicate, dtoClass);
  }

  @Override
  @Transactional
  public int deleteRecordsOlderThanDays(final int days) {
    final DateTime expireDate = new DateTime(DateTimeZone.UTC).minusDays(days);
    final Timestamp expireTimestamp = new Timestamp(expireDate.getMillis());
    final Predicate timestampPredicate = Predicate.LT("createTime", expireTimestamp);
    return deleteByPredicate(timestampPredicate);
  }

  @Override
  public List<E> findAll() {
    return (List<E>) genericPojoDao.getAll(dtoClass);
  }

  @Override
  public List<E> findByPredicate(final Predicate predicate) {
    return genericPojoDao.getV2(
        new DaoFilter().setPredicate(predicate).setBeanClass(dtoClass));
  }

  @Override
  public List<E> filter(final DaoFilter daoFilter) {
    return genericPojoDao.getV2(daoFilter.setBeanClass(dtoClass));
  }

  @Override
  public long count() {
    return genericPojoDao.count(dtoClass);
  }

  @Override
  public long count(final Predicate predicate) {
    return genericPojoDao.count(predicate, dtoClass);
  }

  @Override
  public void registerDatabaseMetrics() {
    // do nothing by default
  }
}

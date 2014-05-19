package cz.trainlocator.manager;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Key;

import cz.trainlocator.entity.GroupEntity;
import cz.trainlocator.entity.ObservationEntity;
import cz.trainlocator.exception.NotFoundException;
import cz.trainlocator.mapping.GroupMapping;

public class GroupManager {
	public static GroupEntity addGroup(GroupMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		GroupEntity entity = new GroupEntity();
		try {
			setData(entity, mapping, pm);
			pm.makePersistent(entity);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static GroupEntity updateGroup(String key, GroupMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		GroupEntity updated;
		try {
			updated = selectGroup(pm, key);
			setData(updated, mapping, pm);
		} finally {
			pm.close();
		}
		return updated;
	}

	public static GroupEntity findGroup(String key) {
		PersistenceManager pm = Persistence.getManager();
		GroupEntity entity;
		try {
			entity = selectGroup(pm, key);
			entity.getObservation();
		} finally {
			pm.close();
		}
		return entity;
	}

	public static GroupEntity findGroup(Key key) {
		PersistenceManager pm = Persistence.getManager();
		GroupEntity entity;
		try {
			entity = selectGroup(pm, key);
			entity.getObservation();
		} finally {
			pm.close();
		}
		return entity;
	}

	public static List<GroupEntity> findByObservation(String observationId) {
		List<GroupEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			ObservationEntity obser = ObservationManager.selectObservation(pm, observationId);
			result = selectByObservationEntity(obser, pm);
		} finally {
			pm.close();
		}
		return result;
	}

	public static List<GroupEntity> findByObservation(ObservationEntity obser) {
		List<GroupEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			result = selectByObservationEntity(obser, pm);
		} finally {
			pm.close();
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<GroupEntity> selectByObservationEntity (ObservationEntity obser, PersistenceManager pm) {
		List<GroupEntity> result;
		
		Query q = pm.newQuery(GroupEntity.class, "observation == obs");
		q.declareParameters("ObservationEntity obs");
		q.setOrdering("name asc");
		
		result = (List<GroupEntity>) q.execute(obser);
		
		for (GroupEntity g : result) {
			g.getObservation();
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static List<GroupEntity> findAllGroup() {
		List<GroupEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			Query query = Persistence.getManager().newQuery(GroupEntity.class);
			result = (List<GroupEntity>) query.execute();
		} finally {
			pm.close();
		}
		return result;
	}

	public static void deleteGroup(String key) {
		PersistenceManager pm = Persistence.getManager();
		try {
			GroupEntity o = selectGroup(pm, key);
			pm.deletePersistent(o);
		} finally {
			pm.close();
		}
	}

	private static void setData(GroupEntity entity, GroupMapping map, PersistenceManager pm) {
		entity.setName(map.getName());
		entity.setObservation(ObservationManager.selectObservation(pm,
				map.getObservationId()));
	}

	static GroupEntity selectGroup(PersistenceManager pm, String key) {
		try {
			GroupEntity entity = pm.getObjectById(GroupEntity.class,
					KeyFactory.stringToKey(key));
			return entity;
		} catch (Exception ex) {
			throw new NotFoundException("Group id=" + key + " not exists");
		}
	}

	static GroupEntity selectGroup(PersistenceManager pm, Key key) {
		try {
			GroupEntity entity = pm.getObjectById(GroupEntity.class, key);
			return entity;
		} catch (Exception ex) {
			throw new NotFoundException("Group id=" + KeyFactory.keyToString(key) + " not exists");
		}
	}
}

package cz.trainlocator.manager;

import java.util.LinkedList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Key;

import cz.trainlocator.entity.DayEntity;
import cz.trainlocator.entity.GroupEntity;
import cz.trainlocator.exception.NotFoundException;
import cz.trainlocator.mapping.DayMapping;

public class DayManager {
	public static DayEntity addDay(DayMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		DayEntity entity = new DayEntity();
		try {
			setData(entity, mapping, pm);
			pm.makePersistent(entity);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static DayEntity updateDay(String key, DayMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		DayEntity updated;
		try {
			updated = selectDay(pm, key);
			setData(updated, mapping, pm);
		} finally {
			pm.flush();
			pm.close();
		}
		return updated;
	}

	public static DayEntity findDay(String key) {
		PersistenceManager pm = Persistence.getManager();
		DayEntity entity;
		try {
			entity = selectDay(pm, key);
			entity.getGroup();
		} finally {
			pm.close();
		}
		return entity;
	}

	public static DayEntity findDay(Key key) {
		PersistenceManager pm = Persistence.getManager();
		DayEntity entity;
		try {
			entity = selectDay(pm, key);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static List<DayEntity> findByGroup(String groupId) {
		List<DayEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			GroupEntity group = GroupManager.selectGroup(pm, groupId);
			result = selectByGroupEntity(group, pm);
		} finally {
			pm.close();
		}
		return result;
	}

	public static List<DayEntity> findByGroup(GroupEntity group) {
		List<DayEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			result = selectByGroupEntity(group, pm);
		} finally {
			pm.close();
		}
		return result;
	}

	public static List<DayEntity> findByGroupList(List<GroupEntity> groupList) {
		List<DayEntity> result = new LinkedList<DayEntity>();
		PersistenceManager pm = Persistence.getManager();
		try {
			for(GroupEntity group : groupList) {
				result.addAll(selectByGroupEntity(group, pm));
			}
		} finally {
			pm.close();
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<DayEntity> selectByGroupEntity(GroupEntity group, PersistenceManager pm) {
		List<DayEntity> result;
		
		Query q = pm.newQuery(DayEntity.class, "group == g");
		q.declareParameters("GroupEntity g");
		q.setOrdering("name asc");
		
		result = (List<DayEntity>) q.execute(group);

		for (DayEntity d : result) {
			d.getGroup();
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static List<DayEntity> findAllDay() {
		List<DayEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			Query query = Persistence.getManager().newQuery(DayEntity.class);
			
			result = (List<DayEntity>) query.execute();
		} finally {
			pm.close();
		}
		return result;
	}

	public static void deleteDay(String key) {
		PersistenceManager pm = Persistence.getManager();
		try {
			DayEntity o = selectDay(pm, key);
			pm.deletePersistent(o);
		} finally {
			pm.close();
		}
	}

	private static void setData(DayEntity entity, DayMapping map, PersistenceManager pm) {
		entity.setName(map.getName());
		entity.setGroup(GroupManager.selectGroup(pm, map.getGroupId()));
	}

	static DayEntity selectDay(PersistenceManager pm, String key) {
		try {
			DayEntity entity = pm.getObjectById(DayEntity.class, KeyFactory.stringToKey(key));
			return entity;
		} catch (Exception ex) {
			throw new NotFoundException("Day id="+key+" not exists");
		}
	}

	static DayEntity selectDay(PersistenceManager pm, Key key) {
		try {
			DayEntity entity = pm.getObjectById(DayEntity.class, key);
			return entity;
		} catch (Exception ex) {
    		throw new NotFoundException("Day id="+KeyFactory.keyToString(key)+" not exists");
    	}
	}
}

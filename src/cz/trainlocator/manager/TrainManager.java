package cz.trainlocator.manager;

import java.util.LinkedList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Key;

import cz.trainlocator.entity.TrainEntity;
import cz.trainlocator.entity.DayEntity;
import cz.trainlocator.exception.NotFoundException;
import cz.trainlocator.mapping.TrainMapping;

public class TrainManager {
	public static TrainEntity addTrain(TrainMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		TrainEntity entity = new TrainEntity();
		try {
			setData(entity, mapping, pm);
			pm.makePersistent(entity);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static TrainEntity updateTrain(String key, TrainMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		TrainEntity updated;
		try {
			updated = selectTrain(pm, key);
			setData(updated, mapping, pm);
		} finally {
			pm.close();
		}
		return updated;
	}

	public static TrainEntity findTrain(String key) {
		PersistenceManager pm = Persistence.getManager();
		TrainEntity entity;
		try {
			entity = selectTrain(pm, key);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static TrainEntity findTrain(Key key) {
		PersistenceManager pm = Persistence.getManager();
		TrainEntity entity;
		try {
			entity = selectTrain(pm, key);
		} finally {
			pm.close();
		}
		return entity;
	}
	
	public static List<TrainEntity> findTrainByNumber(Integer number) {
		PersistenceManager pm = Persistence.getManager();
		List<TrainEntity> entity;
		try {
			entity = selectTrainByNumber(pm, number);
		} finally {
			pm.close();
		}
		return entity;
	}

	public static List<TrainEntity> findByDay(String dayId) {
		List<TrainEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			DayEntity day = DayManager.selectDay(pm, dayId);

			result = selectByDayEntity(day, pm);
		} finally {
			pm.close();
		}
		return result;
	}

	public static List<TrainEntity> findByDay(DayEntity day) {
		List<TrainEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			result = selectByDayEntity(day, pm);
		} finally {
			pm.close();
		}
		return result;
	}
	
	public static List<TrainEntity> findByDayList(List<DayEntity> dayList) {
		List<TrainEntity> result = new LinkedList<TrainEntity>();
		PersistenceManager pm = Persistence.getManager();
		try {
			for (DayEntity day : dayList) {
				result.addAll(selectByDayEntity(day, pm));
			}
		} finally {
			pm.close();
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<TrainEntity> selectByDayEntity(DayEntity day, PersistenceManager pm) {
		List<TrainEntity> result;
		
		Query q = pm.newQuery(TrainEntity.class, "day == d");
		q.declareParameters("DayEntity d");
		

		result = (List<TrainEntity>) q.execute(day);
		
		for (TrainEntity tr : result) {
			tr.getDay();
		}
		return result;
	}

	@SuppressWarnings("unchecked")
	public static List<TrainEntity> findAllTrain() {
		List<TrainEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			Query query = Persistence.getManager().newQuery(TrainEntity.class);
			result = (List<TrainEntity>) query.execute();
		} finally {
			pm.close();
		}
		return result;
	}

	public static void deleteTrain(String key) {
		PersistenceManager pm = Persistence.getManager();
		try {
			TrainEntity o = selectTrain(pm, key);
			pm.deletePersistent(o);
		} finally {
			pm.close();
		}
	}

	private static void setData(TrainEntity entity, TrainMapping map, PersistenceManager pm) {
		entity.setNumber(map.getNumber());
		entity.setTrack(map.getTrack());
		entity.setLimits(map.getLimits());
		entity.setType(map.getType());
		entity.setDay(DayManager.selectDay(pm, map.getDayId()));
	}

	static TrainEntity selectTrain(PersistenceManager pm, String key) {
		try {
			TrainEntity entity = pm.getObjectById(TrainEntity.class, KeyFactory.stringToKey(key));
			return entity;
		} catch (Exception ex) {
			throw new NotFoundException("Train id="+key+" not exists");
		}
	}

	static TrainEntity selectTrain(PersistenceManager pm, Key key) {
		try {
			TrainEntity entity = pm.getObjectById(TrainEntity.class, key);
			return entity;
		} catch (Exception ex) {
    		throw new NotFoundException("Train id="+KeyFactory.keyToString(key)+" not exists");
    	}
	}
	
	@SuppressWarnings("unchecked")
	static List<TrainEntity> selectTrainByNumber(PersistenceManager pm, Integer number) {
		List<TrainEntity> result;
		Query q = pm.newQuery(TrainEntity.class, "number == nr");
		q.declareParameters("Integer nr");

		result = (List<TrainEntity>) q.execute(number);
		return result;
	}
}

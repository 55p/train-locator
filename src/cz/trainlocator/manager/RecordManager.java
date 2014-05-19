package cz.trainlocator.manager;

import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import cz.trainlocator.entity.TrainEntity;
import cz.trainlocator.entity.RecordEntity;
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.exception.NotFoundException;
import cz.trainlocator.mapping.RecordMapping;

public class RecordManager {

	public static RecordEntity addObservation(RecordMapping mapping) {
		PersistenceManager pm = Persistence.getManager();
		RecordEntity entity = new RecordEntity();
		try {
			setData(entity, mapping, pm);
			pm.makePersistent(entity);
		} finally {
			pm.close();
		}
		return entity;
	}
/*
    //nepouzito 
	@SuppressWarnings("unchecked")
	public static List<RecordEntity> findAllTrainObservation() {
		List<RecordEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			Query query = Persistence.getManager().newQuery(RecordEntity.class);
			result = (List<RecordEntity>) query.execute();
		} finally {
			pm.close();
		}
		return result;
	}
*/
	public static List<RecordEntity> findByTrain(String trainId) {
		List<RecordEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			TrainEntity train = TrainManager.selectTrain(pm, trainId);
			result = selectByTrainEntity(train, pm);
		} finally {
			pm.close();
		}
		return result;
	}

	public static List<RecordEntity> findByTrain(TrainEntity train) {
		List<RecordEntity> result;
		PersistenceManager pm = Persistence.getManager();
		try {
			result = selectByTrainEntity(train, pm);
		} finally {
			pm.close();
		}
		return result;
	}
	
	public static List<RecordEntity> findByTrainList(List<TrainEntity> trainList, int year, int month, int day) {
		List<RecordEntity> result = new LinkedList<RecordEntity>();
		PersistenceManager pm = Persistence.getManager();
		try {
			for (TrainEntity train : trainList) {
				result.addAll(selectByTrainEntity(train, year, month, day, pm));
			}
		} finally {
			pm.close();
		}
		return result;
	}
	
	public static List<RecordEntity> findByTrainList(List<TrainEntity> trainList, int year, int month) {
		List<RecordEntity> result = new LinkedList<RecordEntity>();
		PersistenceManager pm = Persistence.getManager();
		try {
			for (TrainEntity train : trainList) {
				result.addAll(selectByTrainEntity(train, year, month, pm));
			}
		} finally {
			pm.close();
		}
		return result;
	}
	
	public static List<RecordEntity> findByTrainList(List<TrainEntity> trainList, int dayCount) {
		List<RecordEntity> result = new LinkedList<RecordEntity>();
		PersistenceManager pm = Persistence.getManager();
		try {
			Calendar start = Calendar.getInstance();
//			start.setTime(new Date());

			Calendar end = Calendar.getInstance();
			end.add(Calendar.DATE, -dayCount);///setTime(endDate);

			while(start.after(end)){
			    //Date targetDay = start.getTime();
			    // Do Work Here
			    for (TrainEntity train : trainList) {
					result.addAll(selectByTrainEntity(train, start.get(Calendar.YEAR), start.get(Calendar.MONTH)+1, start.get(Calendar.DATE), pm));
				}
			    start.add(Calendar.DATE, -1);
			    
			}
		} finally {
			pm.close();
		}
		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<RecordEntity> selectByTrainEntity(TrainEntity train, PersistenceManager pm) {
		List<RecordEntity> result;
		
		Query q = pm.newQuery(RecordEntity.class, "train == tr");
		q.declareParameters("TrainEntity tr");

		result = (List<RecordEntity>) q.execute(train);

		for (RecordEntity d : result) {
			d.getTrain();
		}

		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<RecordEntity> selectByTrainEntity(TrainEntity train, int year, int month, int day, PersistenceManager pm) {
		List<RecordEntity> result;
		
		Query q = pm.newQuery(RecordEntity.class, "train == tr && year == y && month == m && day == d");
		q.declareParameters("TrainEntity tr, int y, int m, int d");
		
		@SuppressWarnings("rawtypes")
		Map parameters = new HashMap();
	    parameters.put("tr", train);   
	    parameters.put("y", new Integer(year));
	    parameters.put("m", new Integer(month));
	    parameters.put("d", new Integer(day));

		result = (List<RecordEntity>) q.executeWithMap(parameters);

		for (RecordEntity d : result) {
			d.getTrain();
		}

		return result;
	}
	
	@SuppressWarnings("unchecked")
	private static List<RecordEntity> selectByTrainEntity(TrainEntity train, int year, int month, PersistenceManager pm) {
		List<RecordEntity> result;
		
		Query q = pm.newQuery(RecordEntity.class, "train == tr && year == y && month == m");
		q.declareParameters("TrainEntity tr, int y, int m");

		result = (List<RecordEntity>) q.execute(train, year, month);

		for (RecordEntity d : result) {
			d.getTrain();
		}

		return result;
	}
	
	private static void setData(RecordEntity entity, RecordMapping map, PersistenceManager pm) {
		if (map.getTrainId() == null) {
			List<TrainEntity> trains = TrainManager.selectTrainByNumber(pm, map.getTrainNumber());
			if (trains.size() == 1) {
				entity.setTrain(trains.get(0));
			} else if (trains.isEmpty()) {
				throw new BadRequestException("Train nr."+map.getTrainNumber() + " not found.");
			} else {
				throw new BadRequestException("There are more than one train nr."+map.getTrainNumber() + ", send train id.");
			}
		} else {
			entity.setTrain(TrainManager.selectTrain(pm,map.getTrainId()));
		}
		
		if (map.getYear() == 0) {
			entity.setYear(Calendar.getInstance().get(Calendar.YEAR));
		} else {
			entity.setYear(map.getYear());
		}
		
		if (map.getMonth() <= 0 || map.getMonth() > 12) {
			throw new BadRequestException("Month must be in range 1-12.");
		} else {
			entity.setMonth(map.getMonth());
		}
		
		if (map.getDay() <= 0 || map.getDay() > 31) {
			throw new BadRequestException("Day must be in range 1-31.");
		} else {
			entity.setDay(map.getDay());
		}
		
		entity.setVlakova(map.getVlakova());
		entity.setRidiciVuz(map.getRidiciVuz());
		entity.setPriprez(map.getPriprez());
		entity.setPostrk(map.getPostrk());
		entity.setComment(map.getComment());
		entity.setInsertDate(new Date());
	}

	static RecordEntity selectTrainObservation(PersistenceManager pm, String id) {
		try {
			return pm.getObjectById(RecordEntity.class, KeyFactory.stringToKey(id));
		} catch (Exception ex) {
			throw new NotFoundException("Record id " + id + " not exists");
		}
	}

	static RecordEntity selectTrainObservation(PersistenceManager pm, Key key) {
		try {
			return pm.getObjectById(RecordEntity.class, key);
		} catch (Exception ex) {
			throw new NotFoundException("Record id "+ KeyFactory.keyToString(key) + " not exists");
		}

	}
}

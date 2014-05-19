package cz.trainlocator.manager;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import cz.trainlocator.entity.ObservationEntity;
import cz.trainlocator.exception.NotFoundException;
import cz.trainlocator.mapping.ObservationMapping;

public class ObservationManager {

    public static ObservationEntity addObservation(ObservationMapping mapping) {
    	PersistenceManager pm = Persistence.getManager();
		ObservationEntity entity = new ObservationEntity();
    	try {
    		setData(entity, mapping);
    		pm.makePersistent(entity);	
    	} finally {
    		pm.close();
    	}
    	return entity;
    }
    
    public static ObservationEntity updateObservation(String id, ObservationMapping mapping) {
    	PersistenceManager pm = Persistence.getManager();
    	ObservationEntity updated;
    	try {
    		updated = selectObservation(pm, id);
    		setData(updated, mapping);
    	} finally {
    		pm.close();
    	}
    	return updated;
    }
    
    public static ObservationEntity findObservation(String id) {
    	PersistenceManager pm = Persistence.getManager();
    	ObservationEntity entity;
    	try {
    		entity = selectObservation(pm, id);
    	} finally {
    		pm.close();
    	}
    	return entity;
    }
    
    public static ObservationEntity findObservation(Key id) {
    	PersistenceManager pm = Persistence.getManager();
    	ObservationEntity entity;
    	try {
    		entity = selectObservation(pm, id);
    	} finally {
    		pm.close();
    	}
    	return entity;
    }
    
    public static ObservationEntity findByTrain(String id) {
    	Key observationKey = null;
    	try {
	    	Key trainKey = KeyFactory.stringToKey(id);
	    	Key dayKey = trainKey.getParent();
	    	Key groupKey = dayKey.getParent();
	    	observationKey = groupKey.getParent();
    	} catch (Exception e) {
    		throw new NotFoundException("Observation with train ID="+id+" not exists");
    	}
    	
    	PersistenceManager pm = Persistence.getManager();
    	ObservationEntity entity;
    	try {
    		entity = selectObservation(pm, KeyFactory.keyToString(observationKey));
    	} finally {
    		pm.close();
    	}
    	return entity;
    }
    public static ObservationEntity findByDay(String id) {
    	Key observationKey = null;
    	try {
	    	Key dayKey = KeyFactory.stringToKey(id);
	    	Key groupKey = dayKey.getParent();
	    	observationKey = groupKey.getParent();
    	} catch (Exception e) {
    		throw new NotFoundException("Observation with train ID="+id+" not exists");
    	}
    	
    	PersistenceManager pm = Persistence.getManager();
    	ObservationEntity entity;
    	try {
    		entity = selectObservation(pm, KeyFactory.keyToString(observationKey));
    	} finally {
    		pm.close();
    	}
    	return entity;
    }

    @SuppressWarnings("unchecked")
	public static List<ObservationEntity> findAllObservation() {
		List<ObservationEntity> result;
    	PersistenceManager pm = Persistence.getManager();
		try {
			 Query query = Persistence.getManager().newQuery(ObservationEntity.class);
			 result = (List<ObservationEntity>) query.execute();
		} finally {
			pm.close();
		}	
		return result;
    }

    public static void deleteObservation(String id) {
    	PersistenceManager pm = Persistence.getManager();
		try {
			ObservationEntity o = selectObservation(pm, id);
			pm.deletePersistent(o);
		} finally {
			pm.close();
		}	
	}
    
    private static void setData(ObservationEntity entity, ObservationMapping map) {
    	entity.setName(map.getName());
    }
    
    static ObservationEntity selectObservation(PersistenceManager pm, String id) {
    	try {
    		return pm.getObjectById(ObservationEntity.class, KeyFactory.stringToKey(id));
    	} catch (Exception ex) {
    		throw new NotFoundException("Observation id="+id+" not exists");
    	}
    }
    
    static ObservationEntity selectObservation(PersistenceManager pm, Key key) {
    	try {
    		return pm.getObjectById(ObservationEntity.class, key);
    	} catch (Exception ex) {
    		throw new NotFoundException("Observation id="+KeyFactory.keyToString(key)+" not exists");
    	}
    }
}

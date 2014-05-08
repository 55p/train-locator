package cz.trainlocator.entity;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import java.util.List;

import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.ObservationManager;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

@PersistenceCapable
public class GroupEntity {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 2L;
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;
	
	@Persistent
	private String name;
	@Persistent
	private ObservationEntity observation;
	
	@Persistent(mappedBy = "group")
	@Element(dependent = "true")
	private List<DayEntity> days;

	public GroupEntity() {
	}

	public Key getId() {
		return id;
	}

	public void setId(Key id) {
		this.id = id;
	}

	public String getKey() {
		return KeyFactory.keyToString(id);
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ObservationEntity getObservation() {
		if (observation == null) {
			observation = ObservationManager.findObservation(id.getParent());
		}
		return observation;
	}

	public void setObservation(ObservationEntity observation) {
		this.observation = observation;
	}

	public List<DayEntity> getDays() {
		if (days == null) {
			days = DayManager.findByGroup(this);
		}
		return days;
	}

	public void setDays(List<DayEntity> days) {
		this.days = days;
	}

}

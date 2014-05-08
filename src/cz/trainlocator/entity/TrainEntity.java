package cz.trainlocator.entity;

import java.util.List;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.RecordManager;

@PersistenceCapable
public class TrainEntity {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 4L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;
	
	@Persistent
	private DayEntity day;
	@Persistent
	private String type;
	@Persistent
	private int number;
	@Persistent
	private String track;
	@Persistent
	private String limits;
	
	@Persistent(mappedBy="train")
	@Element(dependent = "true")
	private List<RecordEntity> observations;

	public TrainEntity() {
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

	public DayEntity getDay() {
		if (day == null) {
			day = DayManager.findDay(id.getParent());
		}
		return day;
	}

	public void setDay(DayEntity day) {
		this.day = day;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	public String getLimits() {
		return limits;
	}

	public void setLimits(String limits) {
		this.limits = limits;
	}

	public String getTrack() {
		return track;
	}

	public void setTrack(String track) {
		this.track = track;
	}

	public List<RecordEntity> getObservations() {
		if (observations == null) {
			observations = RecordManager.findByTrain(this);
		}
		return observations;
	}

	public void setObservations(List<RecordEntity> observations) {
		this.observations = observations;
	}

}

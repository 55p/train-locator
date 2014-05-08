package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;
import cz.trainlocator.entity.TrainEntity;

public class TrainMapping {
	private String id;
	private String dayId;
	private String type;
	private int number;
	private String limits;
	private String track;

	public TrainMapping() {
	}

	public TrainMapping(TrainEntity train) {
		this.id = train.getKey();
		this.dayId = train.getDay().getKey();
		type = train.getType();
		setNumber(train.getNumber());
		setLimits(train.getLimits());
		setTrack(train.getTrack());
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDayId() {
		return dayId;
	}

	public void setDayId(String dayId) {
		this.dayId = dayId;
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

	public static List<TrainMapping> createList(List<TrainEntity> trains) {
		List<TrainMapping> result = new LinkedList<TrainMapping>();
		for (TrainEntity g : trains) {
			result.add(new TrainMapping(g));
		}
		return result;
	}
}

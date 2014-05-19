package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;
import cz.trainlocator.entity.TrainEntity;

public class TrainMapping implements Comparable <TrainMapping>{
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

	@Override
	public int compareTo(TrainMapping other) {
		int hStart = 0;
		int mStart = 0;
		
		int otHStart = 0;
		int otMStart = 0;
		
		try {
			String[] split = this.track.split("-");
			String[] otherSplit = other.track.split("-");
			
			String[] start = split[0].split(":");
			String[] otherStart = otherSplit[0].split(":");
			
			hStart = Integer.parseInt(start[0].substring(start[0].indexOf("(")+1));
			mStart = Integer.parseInt(start[1].substring(0,2));
			
			otHStart = Integer.parseInt(otherStart[0].substring(otherStart[0].indexOf("(")+1));
			otMStart = Integer.parseInt(otherStart[1].substring(0,2));
			
			if (hStart > otHStart) {
				return 1;
			} 
			if  (otHStart > hStart) {
				return -1;
			}
			if (mStart > otMStart) {
				return 1;
			} 
			if  (otMStart > mStart) {
				return -1;
			}
			return 0;
		} catch (Exception e) {
			return 0;
		}
	}
}

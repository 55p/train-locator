package cz.trainlocator.mapping;

import java.util.List;

public class AllMapping {

	private ObservationMapping observation;
	private List<GroupMapping> groups;
	private List<DayMapping> days;
	private List<TrainMapping> trains;
	
	public AllMapping() {}
	
	public ObservationMapping getObservation() {
		return observation;
	}
	
	public void setObservation(ObservationMapping observation) {
		this.observation = observation;
	}

	public List<GroupMapping> getGroups() {
		return groups;
	}

	public void setGroups(List<GroupMapping> groups) {
		this.groups = groups;
	}

	public List<DayMapping> getDays() {
		return days;
	}

	public void setDays(List<DayMapping> days) {
		this.days = days;
	}

	public List<TrainMapping> getTrains() {
		return trains;
	}

	public void setTrains(List<TrainMapping> trains) {
		this.trains = trains;
	}
}

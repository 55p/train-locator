package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;

import cz.trainlocator.entity.GroupEntity;

public class GroupMapping {

	private String id;
	private String observationId;
	private String name;

	public GroupMapping() {
	}

	public GroupMapping(GroupEntity ge) {
		setId(ge.getKey());
		setObservationId(ge.getObservation().getKey());
		setName(ge.getName());
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getObservationId() {
		return observationId;
	}

	public void setObservationId(String observationId) {
		this.observationId = observationId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static List<GroupMapping> createList(List<GroupEntity> groups) {
		List<GroupMapping> result = new LinkedList<GroupMapping>();
		for (GroupEntity g : groups) {
			result.add(new GroupMapping(g));
		}
		return result;
	}
}

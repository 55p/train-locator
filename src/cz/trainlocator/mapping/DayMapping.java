package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;

import cz.trainlocator.entity.DayEntity;

public class DayMapping {

	private String id;
	private String groupId;
	private String name;

	public DayMapping() {
	}

	public DayMapping(DayEntity de) {
		this.id = de.getKey();
		this.groupId = de.getGroup().getKey();
		setName(de.getName());
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getGroupId() {
		return groupId;
	}

	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public static List<DayMapping> createList(List<DayEntity> days) {
		List<DayMapping> result = new LinkedList<DayMapping>();
		for (DayEntity g : days) {
			result.add(new DayMapping(g));
		}
		return result;
	}
}

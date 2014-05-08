package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;

import cz.trainlocator.entity.ObservationEntity;

public class ObservationMapping {

	private String id;
	private String name;

	// private String uri;
	// private String groupUri;

	public ObservationMapping() {
	}

	public ObservationMapping(ObservationEntity e) {
		id = e.getKey();
		name = e.getName();
		// uri = "/";
		// groupUri = "/group";
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	/*
	 public String getGroupUri() { return groupUri; }
	 
	public void setGroupUri(String groupUri) { this.groupUri = groupUri; }
	  
	 public String getUri() { return uri; }
	  
	 public void setUri(String uri) { this.uri = uri; }
	 */
	public static List<ObservationMapping> createList(
			List<ObservationEntity> Observations) {
		List<ObservationMapping> result = new LinkedList<ObservationMapping>();
		for (ObservationEntity g : Observations) {
			result.add(new ObservationMapping(g));
		}
		return result;
	}

}

package cz.trainlocator.entity;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import java.util.List;

import cz.trainlocator.manager.GroupManager;

@PersistenceCapable
public class ObservationEntity {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 1L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;
	@Persistent
	private String name;
	@Persistent(mappedBy = "observation")
	@Element(dependent = "true")
	private List<GroupEntity> groups;

	public ObservationEntity() {
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

	public List<GroupEntity> getGroups() {
		if (groups == null) {
			groups = GroupManager.findByObservation(this);
		}
		return groups;
	}

	public void setGroups(List<GroupEntity> groups) {
		this.groups = groups;
	}

}

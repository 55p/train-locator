package cz.trainlocator.entity;

import java.util.List;

import javax.jdo.annotations.Element;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.manager.TrainManager;

@PersistenceCapable
public class DayEntity {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 3L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;

	@Persistent
	private String name;

	@Persistent
	private GroupEntity group;

	@Persistent(mappedBy = "day")
	@Element(dependent = "true")
	private List<TrainEntity> trains;

	public DayEntity() {
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

	public List<TrainEntity> getTrains() {
		if (trains == null) {
			trains = TrainManager.findByDay(this);
		}
		return trains;
	}

	public void setTrains(List<TrainEntity> trains) {
		this.trains = trains;
	}

	public GroupEntity getGroup() {
		if (group == null) {
			group = GroupManager.findGroup(id.getParent());
		}
		return group;
	}

	public void setGroup(GroupEntity group) {
		this.group = group;
	}

}

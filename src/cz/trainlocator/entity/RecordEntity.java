package cz.trainlocator.entity;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import cz.trainlocator.manager.TrainManager;

@PersistenceCapable
public class RecordEntity {
	@SuppressWarnings("unused")
	private static final long serialVersionUID = 5L;

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Key id;
	@Persistent
    private int year;
	@Persistent
    private int month;
	@Persistent
    private int day;
    @Persistent
	private TrainEntity train;

    @Persistent
	private long vlakova;
    @Persistent
	private long ridiciVuz;
    @Persistent
	private long priprez;
    @Persistent
	private long postrk;

    @Persistent
	private String comment;
    @Persistent
	private Date insertDate;
	
	public RecordEntity() {
    }

    public Key getId() {
        return id;
    }

    public void setId(Key id) {
        this.id = id;
    }
	public int getYear() {
		return year;
	}

	public void setYear(int year) {
		this.year = year;
	}

	public int getMonth() {
		return month;
	}

	public void setMonth(int month) {
		this.month = month;
	}

	public int getDay() {
		return day;
	}

	public void setDay(int day) {
		this.day = day;
	}

	public String getKey() {
		return KeyFactory.keyToString(id);
	}

    public TrainEntity getTrain() {
		if (train == null) {
			train = TrainManager.findTrain(id.getParent());
		}
        return train;
    }

    public void setTrain(TrainEntity train) {
        this.train = train;
    }

    public long getVlakova() {
        return vlakova;
    }

    public void setVlakova(long vlakova) {
        this.vlakova = vlakova;
    }

    public long getRidiciVuz() {
        return ridiciVuz;
    }

    public void setRidiciVuz(long ridiciVuz) {
        this.ridiciVuz = ridiciVuz;
    }

    public long getPriprez() {
        return priprez;
    }

    public void setPriprez(long priprez) {
        this.priprez = priprez;
    }

    public long getPostrk() {
        return postrk;
    }

    public void setPostrk(long postrk) {
        this.postrk = postrk;
    }

    public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Date getInsertDate() {
        return insertDate;
    }

    public void setInsertDate(Date insertDate) {
        this.insertDate = insertDate;
    }
	
}

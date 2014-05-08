package cz.trainlocator.mapping;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import cz.trainlocator.entity.RecordEntity;

public class RecordMapping {
	private String id;
	//private Date date;
	private int year;
	private int month;
	private int day;
	private int trainNumber;
	private String trainId;

	private long vlakova;
	private long ridiciVuz;
	private long priprez;
	private long postrk;
	
	private String comment;

	private Date insertDate;

	public RecordMapping() {}
	
	public RecordMapping(RecordEntity record) {
		this.id = record.getKey();

		this.year = record.getYear();
		this.month = record.getMonth();
		this.day = record.getDay();
		
		this.trainId = record.getTrain().getKey();
		this.trainNumber = record.getTrain().getNumber();
		
		this.vlakova = record.getVlakova();
		this.ridiciVuz = record.getRidiciVuz();
		this.priprez = record.getPriprez();
		this.postrk = record.getPostrk();
		
		this.comment = record.getComment();
		this.setInsertDate(record.getInsertDate());
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
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

	public String getTrainId() {
		return trainId;
	}

	public void setTrainId(String trainId) {
		this.trainId = trainId;
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

	public Date getInsertDate() {
		return insertDate;
	}

	public void setInsertDate(Date insertDate) {
		this.insertDate = insertDate;
	}

	public int getTrainNumber() {
		return trainNumber;
	}

	public void setTrainNumber(int trainNumber) {
		this.trainNumber = trainNumber;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public static List<RecordMapping> createList(List<RecordEntity> trains) {
		List<RecordMapping> result = new LinkedList<RecordMapping>();
		for (RecordEntity g : trains) {
			result.add(new RecordMapping(g));
		}
		return result;
	}
}

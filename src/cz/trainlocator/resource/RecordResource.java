package cz.trainlocator.resource;

import java.util.Arrays;
import java.util.Calendar;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import cz.trainlocator.entity.DayEntity;
import cz.trainlocator.entity.GroupEntity;
import cz.trainlocator.entity.TrainEntity;
import cz.trainlocator.entity.RecordEntity;
import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.manager.TrainManager;
import cz.trainlocator.manager.RecordManager;
import cz.trainlocator.mapping.RecordMapping;

@Path("/record")
public class RecordResource {

	@GET
	@Path("/observation/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByObservation(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		Calendar c = Calendar.getInstance();
		
		List<RecordMapping> mappedRecord = findByObservation(id, c.get(Calendar.YEAR), 1+c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH));
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/observation/{id}/{year}/{month}/{day}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByObservationDate(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @PathParam("day") int day, @Context HttpServletRequest httpRequest) {
		List<RecordMapping> mappedRecord = findByObservation(id, year, month, day);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/observation/{id}/{year}/{month}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByObservationMonth(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @Context HttpServletRequest httpRequest) {	
		List<RecordMapping> mappedRecord = findByObservation(id, year, month, -1);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/group/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByGroup(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		Calendar c = Calendar.getInstance();
		
		List<RecordMapping> mappedRecord = findByGroup(id, c.get(Calendar.YEAR), 1+c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH));
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/group/{id}/{year}/{month}/{day}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByGroupDate(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @PathParam("day") int day, @Context HttpServletRequest httpRequest) {
		List<RecordMapping> mappedRecord = findByGroup(id, year, month, day);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/group/{id}/{year}/{month}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByGroupMonth(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @Context HttpServletRequest httpRequest) {	
		List<RecordMapping> mappedRecord = findByGroup(id, year, month, -1);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/day/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByDay(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		Calendar c = Calendar.getInstance();
		
		List<RecordMapping> mappedRecord = findByDay(id, c.get(Calendar.YEAR), 1+c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH));
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/day/{id}/{year}/{month}/{day}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByDayDate(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @PathParam("day") int day, @Context HttpServletRequest httpRequest) {
		List<RecordMapping> mappedRecord = findByDay(id, year, month, day);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/day/{id}/{year}/{month}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByDayMonth(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @Context HttpServletRequest httpRequest) {	
		List<RecordMapping> mappedRecord = findByDay(id, year, month, -1);
		return Response.ok(mappedRecord).build();
	}
  
	@GET
	@Path("/train/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByTrain(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		Calendar c = Calendar.getInstance();
		
		List<RecordMapping> mappedRecord = findByTrain(id, c.get(Calendar.YEAR), 1+c.get(Calendar.MONTH), c.get(Calendar.DAY_OF_MONTH));
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/train/{id}/{year}/{month}/{day}")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByTrainDate(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @PathParam("day") int day, @Context HttpServletRequest httpRequest) {
		List<RecordMapping> mappedRecord = findByTrain(id, year, month, day);
		return Response.ok(mappedRecord).build();
	}
	
	@GET
	@Path("/train/{id}/{year}/{month}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getByTrainMonth(@PathParam("id") String id, @PathParam("year") int year, @PathParam("month") int month, @Context HttpServletRequest httpRequest) {	
		List<RecordMapping> mappedRecord = findByTrain(id, year, month, -1);
		return Response.ok(mappedRecord).build();
	}
  
	private List<RecordMapping> findByObservation(String observationId, int year, int month, int day) {
		List<GroupEntity> groups = GroupManager.findByObservation(observationId);
		return findByGroup(groups, year,month,day);
	}
	
	private List<RecordMapping> findByGroup(String groupId, int year, int month, int day) {
		List<DayEntity> days = DayManager.findByGroup(groupId);
		return findByDay(days, year,month,day);
	}
	private List<RecordMapping> findByGroup(List<GroupEntity> groups, int year, int month, int day) {
		List<DayEntity> days = DayManager.findByGroupList(groups);
		return findByDay(days, year,month,day);
	}

	private List <RecordMapping> findByDay(String dayId, int year, int month, int day) {
		List<TrainEntity> trains = TrainManager.findByDay(dayId);
		return findByTrain(trains, year,month,day);
	}
	private List <RecordMapping> findByDay(List<DayEntity> days, int year, int month, int day) {
		List<TrainEntity> trains = TrainManager.findByDayList(days);
		return findByTrain(trains, year,month,day);
	}
	
	private List <RecordMapping> findByTrain(String trainId, int year, int month, int day) {
		TrainEntity train = TrainManager.findTrain(trainId);
		return findByTrain(Arrays.asList(train), year,month,day);
	}
	private List <RecordMapping> findByTrain(List<TrainEntity> trains, int year, int month, int day) {
		List<RecordEntity> records;
		if (day > 0) {
			records = RecordManager.findByTrainList(trains, year, month, day);
		} else {
			records = RecordManager.findByTrainList(trains, year, month);
		}
		List<RecordMapping> mappedRecord = RecordMapping.createList(records);
		return mappedRecord;
	}
}
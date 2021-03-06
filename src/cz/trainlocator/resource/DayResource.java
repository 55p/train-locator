package cz.trainlocator.resource;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.OPTIONS;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import cz.trainlocator.entity.DayEntity;
import cz.trainlocator.entity.GroupEntity;
import cz.trainlocator.entity.ObservationEntity;
import cz.trainlocator.entity.TrainEntity;
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.manager.ObservationManager;
import cz.trainlocator.manager.TrainManager;
import cz.trainlocator.mapping.AllMapping;
import cz.trainlocator.mapping.DayMapping;
import cz.trainlocator.mapping.GroupMapping;
import cz.trainlocator.mapping.ObservationMapping;
import cz.trainlocator.mapping.TrainMapping;

@Path("/day/")
public class DayResource {
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAll(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<DayEntity> list = DayManager.findAllDay();
		List<DayMapping> days = DayMapping.createList(list);
		return Response.ok(days).build();
	}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(DayMapping day, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		DayEntity d = DayManager.addDay(day);
		return Response.ok(new DayMapping(d)).build();
	}
	
	@GET
	@Path("{id}/train")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGroups(@PathParam("id") String id,  @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<TrainEntity> list = TrainManager.findByDay(id);
		List<TrainMapping> groups = TrainMapping.createList(list);
		return Response.ok(groups).build();
	}
	
	@GET
	@Path("{id}/data")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getData(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");

		ObservationEntity obs = ObservationManager.findByDay(id);
		ObservationMapping obsMapping = new ObservationMapping(obs);
		
		List<GroupEntity> groupList = GroupManager.findByObservation(obs.getKey());
		List<GroupMapping> groupMapping = GroupMapping.createList(groupList);
		
		List<DayEntity> dayList = DayManager.findByGroupList(groupList);
		List<DayMapping> dayMapping = DayMapping.createList(dayList);
		
		List<TrainEntity> trainList = TrainManager.findByDayList(dayList);
		List<TrainMapping> trainMapping = TrainMapping.createList(trainList);
		Collections.sort(trainMapping);
		
		AllMapping all = new AllMapping();
		
		all.setObservation(obsMapping);
		all.setGroups(groupMapping);
		all.setDays(dayMapping);
		all.setTrains(trainMapping);

		return Response.ok(all).build();
	}

	@GET
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		DayEntity d = DayManager.findDay(id);
		return Response.ok(new DayMapping(d)).build();
	}

	@PUT
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response change(DayMapping day, @PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		DayEntity e = DayManager.updateDay(id, day);
		return Response.ok(new DayMapping(e)).build();
	}

	@DELETE
	@Path("/{id}/")
	public Response delete(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<TrainEntity> list = TrainManager.findByDay(id);
		if (list.size() > 0) {
			throw new BadRequestException("There are some trains.");
		}

		DayManager.deleteDay(id);
		return Response.noContent().build();
	}
	
	@OPTIONS
	@Path("/")
    public Response options(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, HEAD");
	    
		return Response.ok("").build();
	}
	@OPTIONS
	@Path("/{id}/")
    public Response optionsId(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, HEAD");
	    
		return Response.ok("").build();
	}

}
package cz.trainlocator.resource;

import java.util.Collections;
import java.util.LinkedList;
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
import cz.trainlocator.entity.RecordEntity;
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.manager.ObservationManager;
import cz.trainlocator.manager.TrainManager;
import cz.trainlocator.manager.RecordManager;
import cz.trainlocator.mapping.AllMapping;
import cz.trainlocator.mapping.DayMapping;
import cz.trainlocator.mapping.GroupMapping;
import cz.trainlocator.mapping.ObservationMapping;
import cz.trainlocator.mapping.TrainMapping;
import cz.trainlocator.mapping.RecordMapping;

@Path("/train/")
public class TrainResource {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAll(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<TrainEntity> list = TrainManager.findAllTrain();
		List<TrainMapping> trains = TrainMapping.createList(list);
		return Response.ok(trains).build();
	}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(TrainMapping train, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		TrainEntity t = TrainManager.addTrain(train);
		return Response.ok(new TrainMapping(t)).build();
	}

	@POST
	@Path("/multiple")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAll(List<TrainMapping> trainList, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List <TrainMapping> result = new LinkedList<TrainMapping>();
		for (TrainMapping train : trainList) {
			try {
				TrainEntity t = TrainManager.addTrain(train);
				result.add(new TrainMapping(t));
			} catch (Exception ex) {
			}
		}
		return Response.ok(result).build();
	}

	@POST
	@Path("/{id}/add")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRecord(@PathParam("id") String id, RecordMapping record, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		record.setTrainId(id);
		RecordEntity e = RecordManager.addObservation(record);
		return Response.ok(new RecordMapping(e)).build();
	}
	
	@GET
	@Path("{id}/data")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getData(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");

		ObservationEntity obs = ObservationManager.findByTrain(id);
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
	@Path("/find/{nr}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findTrain(@PathParam("nr") Integer number, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<TrainEntity> t = TrainManager.findTrainByNumber(number);
		List<TrainMapping> trains = TrainMapping.createList(t);
		return Response.ok(trains).build();
	}

	@GET
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		TrainEntity t = TrainManager.findTrain(id);
		return Response.ok(new TrainMapping(t)).build();
	}

	@PUT
	@Path("/{id}/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response change(TrainMapping train, @PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		TrainEntity e = TrainManager.updateTrain(id, train);
		return Response.ok(new TrainMapping(e)).build();
	}

	@DELETE
	@Path("/{id}/")
	public Response delete(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<RecordEntity> list = RecordManager.findByTrain(id);
		if (list.size() > 0) {
			throw new BadRequestException("There are some observations.");
		}

		TrainManager.deleteTrain(id);
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
	@OPTIONS
	@Path("/{id}/add")
    public Response optionsAdd(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, HEAD");
	    
		return Response.ok("").build();
	}
	@OPTIONS
	@Path("/multiple/")
    public Response optionsMult(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		response.addHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		response.addHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS, HEAD");
	    
		return Response.ok("").build();
	}
}
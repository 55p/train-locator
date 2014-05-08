package cz.trainlocator.resource;

import java.util.LinkedList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import cz.trainlocator.entity.TrainEntity;
import cz.trainlocator.entity.RecordEntity;
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.manager.TrainManager;
import cz.trainlocator.manager.RecordManager;
import cz.trainlocator.mapping.TrainMapping;
import cz.trainlocator.mapping.RecordMapping;

@Path("/train/")
public class TrainResource {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAll(@Context HttpServletRequest httpRequest) {
		List<TrainEntity> list = TrainManager.findAllTrain();
		List<TrainMapping> trains = TrainMapping.createList(list);
		return Response.ok(trains).build();
	}

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response create(TrainMapping train, @Context HttpServletRequest httpRequest) {
		TrainEntity t = TrainManager.addTrain(train);
		return Response.ok(new TrainMapping(t)).build();
	}

	@POST
	@Path("/multiple")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response createAll(List<TrainMapping> trainList, @Context HttpServletRequest httpRequest) {
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

	@GET
	@Path("/{id}/add")
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRecord(@PathParam("id") String id, RecordMapping record, @Context HttpServletRequest httpRequest) {
		//TrainEntity t = TrainManager.findTrain(id);
		record.setTrainId(id);
		RecordEntity e = RecordManager.addObservation(record);
		return Response.ok(new RecordMapping(e)).build();
	}
	
	@GET
	@Path("/find/{nr}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response findTrain(@PathParam("nr") Integer number, @Context HttpServletRequest httpRequest) {
		List<TrainEntity> t = TrainManager.findTrainByNumber(number);
		List<TrainMapping> trains = TrainMapping.createList(t);
		return Response.ok(trains).build();
	}

	@GET
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		TrainEntity t = TrainManager.findTrain(id);
		return Response.ok(new TrainMapping(t)).build();
	}

	@PUT
	@Path("/{id}/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public Response change(TrainMapping train, @PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		TrainEntity e = TrainManager.updateTrain(id, train);
		return Response.ok(new TrainMapping(e)).build();
	}

	@DELETE
	@Path("/{id}/")
	public Response delete(@PathParam("id") String id, @Context HttpServletRequest httpRequest) {
		List<RecordEntity> list = RecordManager.findByTrain(id);
		if (list.size() > 0) {
			throw new BadRequestException("There are some observations.");
		}

		TrainManager.deleteTrain(id);
		return Response.noContent().build();
	}
}
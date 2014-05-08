package cz.trainlocator.resource;

import java.util.List;

import javax.servlet.http.HttpServletResponse;
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

import cz.trainlocator.entity.GroupEntity;
import cz.trainlocator.entity.ObservationEntity;
import cz.trainlocator.entity.RecordEntity;
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.manager.ObservationManager;
import cz.trainlocator.manager.RecordManager;
import cz.trainlocator.mapping.GroupMapping;
import cz.trainlocator.mapping.ObservationMapping;
import cz.trainlocator.mapping.RecordMapping;


@Path("/observation/")
public class ObservationResource {

	@POST
	@Path("/add/")
	@Consumes({MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	public Response addRecord(RecordMapping observation, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		RecordEntity e = RecordManager.addObservation(observation);
		return Response.ok(new RecordMapping(e)).build();
	}
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAll(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<ObservationEntity> list = ObservationManager.findAllObservation();
		return Response.ok(ObservationMapping.createList(list)).build();
	}
	
	@GET
	@Path("{id}/group")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGroups(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<GroupEntity> list = GroupManager.findByObservation(id);
		List<GroupMapping> groups = GroupMapping.createList(list);
		return Response.ok(groups).build();
	}
	
	@POST
	@Path("/")
	@Consumes({MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
    public Response create(ObservationMapping observation, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		ObservationEntity o = ObservationManager.addObservation(observation);
		return Response.ok(new ObservationMapping(o)).build();
	}
	
	@GET
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		ObservationEntity o = ObservationManager.findObservation(id);
		return Response.ok(new ObservationMapping(o)).build();
	}
	
	@PUT
	@Path("/{id}/")
	@Consumes({MediaType.APPLICATION_JSON})
	@Produces(MediaType.APPLICATION_JSON)
	public Response update(ObservationMapping observation, @PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		ObservationEntity e = ObservationManager.updateObservation(id, observation);
		return Response.ok(new ObservationMapping(e)).build();
	}
	
	@DELETE
	@Path("/{id}/")
	public Response delete(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<GroupEntity> list = GroupManager.findByObservation(id);
		if (list.size() > 0) {
			throw new BadRequestException("There are some groups.");
		}
		
		ObservationManager.deleteObservation(id);
		return Response.noContent().build();
	}	

}
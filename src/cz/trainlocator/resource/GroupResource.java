package cz.trainlocator.resource;

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
import cz.trainlocator.exception.BadRequestException;
import cz.trainlocator.manager.DayManager;
import cz.trainlocator.manager.GroupManager;
import cz.trainlocator.mapping.DayMapping;
import cz.trainlocator.mapping.GroupMapping;

@Path("/group/")
public class GroupResource {
	
	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getAll(@Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<GroupEntity> list = GroupManager.findAllGroup();
		List<GroupMapping> groups = GroupMapping.createList(list);
		return Response.ok(groups).build();
	}

	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response create(GroupMapping mapping, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		GroupEntity g = GroupManager.addGroup(mapping);
		return Response.ok(new GroupMapping(g)).build();
	}
	
	@GET
	@Path("{id}/day")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getGroups(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<DayEntity> list = DayManager.findByGroup(id);
		List<DayMapping> groups = DayMapping.createList(list);
		return Response.ok(groups).build();
	}

	@GET
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response getById(@PathParam("id") String id, @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		GroupEntity g = GroupManager.findGroup(id);
		return Response.ok(new GroupMapping(g)).build();
	}

	@PUT
	@Path("/{id}/")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public Response change(GroupMapping group, @PathParam("id") String id,  @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		GroupEntity e = GroupManager.updateGroup(id, group);
		return Response.ok(new GroupMapping(e)).build();
	}

	@DELETE
	@Path("/{id}/")
	public Response delete(@PathParam("id") String id,  @Context HttpServletResponse response) {
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		List<DayEntity> list = DayManager.findByGroup(id);
		if (list.size() > 0) {
			throw new BadRequestException("There are some days.");
		}

		GroupManager.deleteGroup(id);
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
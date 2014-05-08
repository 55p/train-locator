package cz.trainlocator.resource;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import cz.trainlocator.mapping.RootMapping;

@Path("/")
public class RootResource {

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public Response get(@Context HttpServletRequest httpRequest) {
		return Response.ok(RootMapping.getRoot()).build();
	}
}

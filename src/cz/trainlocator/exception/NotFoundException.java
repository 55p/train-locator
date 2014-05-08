package cz.trainlocator.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * Thrown to return a 404 Not Found response with a list of error messages in
 * the body.
 */
public class NotFoundException extends WebApplicationException {

    private static final long serialVersionUID = 400L;
    private String error;

    public NotFoundException(String error) {
        super(Response.status(Status.NOT_FOUND).type(MediaType.TEXT_PLAIN)
                .entity(error).build());
        this.error = error;
    }

    public String getError() {
        return error;
    }
}

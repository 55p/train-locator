package cz.trainlocator.exception;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

/**
 * Thrown to return a 400 Bad Request response with a list of error messages in
 * the body.
 */
public class BadRequestException extends WebApplicationException {

    private static final long serialVersionUID = 100L;
    private String error;

    public BadRequestException(String error) {
        super(Response.status(Status.BAD_REQUEST).type(MediaType.TEXT_PLAIN)
                .entity(error).build());
        this.error = error;
    }

    public String getError() {
        return error;
    }
}

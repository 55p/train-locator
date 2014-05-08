package cz.trainlocator.mapping;

import java.util.LinkedList;
import java.util.List;

public class RootMapping {
	private String type;
	private String uri;

	public RootMapping() {
	}

	public RootMapping(String type, String uri) {
		setType(type);
		setUri(uri);
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	public static List<RootMapping> getRoot() {
		List<RootMapping> root = new LinkedList<RootMapping>();
		root.add(new RootMapping("Observations", "/observation"));
		root.add(new RootMapping("Groups", "/group"));
		root.add(new RootMapping("Days", "/day"));
		root.add(new RootMapping("Trains", "/train"));
		return root;
	}
}

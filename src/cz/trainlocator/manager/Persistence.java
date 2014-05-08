package cz.trainlocator.manager;

import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;

public final class Persistence {
    private static final PersistenceManagerFactory pmfInstance = JDOHelper.getPersistenceManagerFactory("transactions-optional");

    private Persistence() {}

    static PersistenceManager getManager() {
        return pmfInstance.getPersistenceManager();
    }
    
}
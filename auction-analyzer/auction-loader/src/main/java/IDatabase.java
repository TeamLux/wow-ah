/**
 * Created by kollektiv on 07/04/15.
 */
import org.json.JSONObject;

import java.sql.PreparedStatement;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Connection;

public class IDatabase {

    private Connection connection;
    private String database;
    private String query;

    public IDatabase (String hostname, String database, String username, String password) throws SQLException {
        this.database = database;

        connection = DriverManager.getConnection(
                "jdbc:mysql://" + hostname + "/" + database + "?user=" + username + "&password=" + password
        );
        
        StringBuilder sb = new StringBuilder(20); //grosso modo
        sb.append("INSERT INTO ");
        sb.append(database);
        sb.append(".auctions VALUES(");
        sb.append("default,"); 	
        sb.append("?,");		// 1)  startfile 	(Date)
        sb.append("?,");		// 2)  startest		(Date)
        sb.append("?,");		// 3)  endfile		(Date)
        sb.append("?,");		// 4)  endest		(Date)
        sb.append("?,");		// 5)  auctionid	(String)
        sb.append("?,");		// 6)  userid		(String)
        sb.append("?,");		// 7)  realm		(String)
        sb.append("?,");		// 8)  itemid		(String)  
        sb.append("?,");		// 9)  quant		(Number)
        sb.append("?,");		// 10) buyout		(Number)
        sb.append("?)");		// 11) bid			(Number)
        query = sb.toString();
    }

    public void createAuctions (JSONObject[] auctions, JSONObject file) throws SQLException {
        for (JSONObject auction : auctions) {
            try {
                this.createAuction(auction, file);
            }
            catch (SQLException e) {
                throw e;
            }
            finally {
                close();
            }
        }
    }

    public PreparedStatement updateAuction (JSONObject auction) {
        
    }

    public PreparedStatement createAuction (JSONObject auction, JSONObject file) throws SQLException {
    	
        PreparedStatement preparedStatement = connection.prepareStatement(query);

        // 1) startfile (Date)
        preparedStatement.setDate(1, new java.sql.Date(
                java.util.Date(file.getLong("modified" )).getTime()
        ));
        // 2) startest (Date)
        preparedStatement.setDate(2, new java.sql.Date(
                java.util.Date(file.getLong("modified" )).getTime()
        ));
        // 3) endfile (Date)
        preparedStatement.setDate(3, new java.sql.Date(
                java.util.Date(file.getLong("modified" )).getTime()
        ));
        // 4) endest (Date)
        preparedStatement.setDate(4, new java.sql.Date(
                java.util.Date(file.getLong("modified" )).getTime()
        ));
        // 5) auctionid (String)
        preparedStatement.setString(5, auction.getString("auc" ));
        // 6) userid (String)
        preparedStatement.setString(6, auction.getString("owner" ));
        // 7) realm (String)
        preparedStatement.setString(7, auction.getString("ownerRealm" ));
        // 8) itemid (String)
        preparedStatement.setString(8, auction.getString("item" ));
        // 9) quant (Number)
        preparedStatement.setInt(9, auction.getInt("quantity" ));
        // 11) buyout (Number)
        preparedStatement.setLong(10, auction.getLong("buyout" ));
        // 11) bid (Number)
        preparedStatement.setLong(11, auction.getLong("bid" ));

        return preparedStatement;
    }

    private void close () throws SQLException {
        connection.close();
    }

}
